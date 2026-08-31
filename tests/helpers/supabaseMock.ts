import { vi } from "vitest";

export type RecordedCall = {
  table: string;
  op: "insert" | "update" | "delete" | "select";
  payload?: unknown;
  filters: { column: string; value: unknown }[];
};

/**
 * Minimal chainable stand-in for the Supabase query builder.
 *
 * It records `from(...).op(...).eq(...)` chains so tests can assert *which
 * rows an action targeted* — the ownership questions that matter here.
 */
class QueryBuilder implements PromiseLike<{ data: unknown; error: unknown }> {
  constructor(
    private readonly call: RecordedCall,
    private readonly result: { data: unknown; error: unknown },
  ) {}

  eq(column: string, value: unknown) {
    this.call.filters.push({ column, value });
    return this;
  }

  select() {
    return this;
  }

  maybeSingle() {
    return Promise.resolve(this.result);
  }

  single() {
    return Promise.resolve(this.result);
  }

  order() {
    return this;
  }

  then<TResult1 = { data: unknown; error: unknown }, TResult2 = never>(
    onfulfilled?:
      | ((value: { data: unknown; error: unknown }) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.result).then(onfulfilled, onrejected);
  }
}

export type SupabaseMockOptions = {
  /** Signed-in user, or null for an anonymous caller. */
  user?: { id: string; email?: string } | null;
  /** Error returned by table operations. */
  dbError?: { message: string; code?: string } | null;
  /** Row returned by select queries. */
  row?: unknown;
  /** Result of `auth.signInWithPassword`. */
  signIn?: { error: unknown };
  /** Result of `auth.signUp`. */
  signUp?: { data: { session: unknown; user: unknown }; error: unknown };
  /** Result of `storage.upload`. */
  upload?: { data: { path: string } | null; error: unknown };
};

export function createSupabaseMock(options: SupabaseMockOptions = {}) {
  const calls: RecordedCall[] = [];
  const uploads: { bucket: string; path: string; options: unknown }[] = [];

  const result = { data: options.row ?? null, error: options.dbError ?? null };

  const client = {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user: options.user ?? null },
        error: null,
      })),
      signInWithPassword: vi.fn(async () => options.signIn ?? { error: null }),
      signUp: vi.fn(
        async () =>
          options.signUp ?? {
            data: { session: { access_token: "t" }, user: { id: "new-user" } },
            error: null,
          },
      ),
      signOut: vi.fn(async () => ({ error: null })),
      resetPasswordForEmail: vi.fn(async () => ({ error: null })),
      updateUser: vi.fn(async () => ({ error: null })),
      exchangeCodeForSession: vi.fn(async () => ({ error: null })),
    },
    from: vi.fn((table: string) => ({
      insert: (payload: unknown) =>
        new QueryBuilder(
          record(calls, { table, op: "insert", payload, filters: [] }),
          result,
        ),
      update: (payload: unknown) =>
        new QueryBuilder(
          record(calls, { table, op: "update", payload, filters: [] }),
          result,
        ),
      delete: () =>
        new QueryBuilder(record(calls, { table, op: "delete", filters: [] }), result),
      select: (payload?: unknown) =>
        new QueryBuilder(
          record(calls, { table, op: "select", payload, filters: [] }),
          result,
        ),
    })),
    storage: {
      from: (bucket: string) => ({
        upload: vi.fn(async (path: string, _file: unknown, opts: unknown) => {
          uploads.push({ bucket, path, options: opts });
          return options.upload ?? { data: { path }, error: null };
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://test.supabase.co/storage/${bucket}/${path}` },
        }),
      }),
    },
  };

  return { client, calls, uploads };
}

function record(calls: RecordedCall[], call: RecordedCall) {
  calls.push(call);
  return call;
}

/** Find the single recorded call for a table/operation pair. */
export function findCall(
  calls: RecordedCall[],
  table: string,
  op: RecordedCall["op"],
) {
  return calls.find((call) => call.table === table && call.op === op);
}
