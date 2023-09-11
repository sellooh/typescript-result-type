export interface Success<Value> {
  status: 'success';
  value: Value;
  expect: (err?: string) => Value;
}

export interface Failure<Value, Reason extends Error> {
  status: 'failure';
  reason: Reason;
  expect: (err?: string) => Value;
}

export type Result<Value, Reason extends Error = Error> =
  | Success<Value>
  | Failure<Value, Reason>;

export function success<Value>(value: Value): Success<Value> {
  return { status: 'success', value, expect: () => value };
}

success.is = <Value, Reason extends Error>(
  result: Result<Value, Reason>,
): result is Success<Value> => {
  return result.status === 'success';
};

failure.is = <Value, Reason extends Error>(
  result: Result<Value, Reason>,
): result is Failure<Value, Reason> => {
  return result.status === 'failure';
};

export function failure<Value, Reason extends Error>(
  reason: Reason,
): Failure<Value, Reason> {
  return {
    status: 'failure',
    reason,
    expect: (err) => {
      if (typeof err !== 'undefined') {
        throw new Error(`${err} > ${reason.message}`);
      }
      throw reason as Error;
    },
  };
}
