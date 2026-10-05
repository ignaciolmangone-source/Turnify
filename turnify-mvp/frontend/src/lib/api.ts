// URL de la API. Se configura en frontend/.env (VITE_API_URL).
// En la app móvil esto mismo va a apuntar al servidor publicado, nunca a localhost.
const API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

// Error de la API con el `code` estable que manda el back (ej: "SLOT_OVERLAP").
export class ApiError extends Error {
  constructor(message: string, public code: string, public status: number) { super(message); }
}

export async function api(path:string,options:RequestInit={}){const token=localStorage.getItem('token');const headers:any={'Content-Type':'application/json',...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(API+path,{...options,headers});const data=await r.json().catch(()=>null);if(!r.ok)throw new ApiError(data?.message||'Error',data?.code||'UNKNOWN',r.status);return data}
