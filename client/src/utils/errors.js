export function message(err){return err?.response?.data?.message||err?.message||'Something went wrong'}
