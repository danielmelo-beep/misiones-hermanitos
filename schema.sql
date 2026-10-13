-- Misiones de Frank y Valentina — esquema de base de datos
-- Ejecutar en el proyecto de Supabase "misiones-hermanitos"

create table if not exists ninos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  color text not null default '#ff3d7f',
  avatar text not null default '🦸',
  creado_at timestamptz not null default now()
);

create table if not exists misiones (
  id serial primary key,
  nombre text not null,
  emoji text not null default '⭐',
  descripcion text,
  xp int not null default 10,
  requiere_foto boolean not null default false,
  activa boolean not null default true,
  orden int not null default 0
);

create table if not exists completados (
  id uuid primary key default gen_random_uuid(),
  nino_id uuid not null references ninos(id) on delete cascade,
  mision_id int not null references misiones(id) on delete cascade,
  fecha date not null default current_date,
  foto_url text,
  created_at timestamptz not null default now(),
  unique (nino_id, mision_id, fecha)
);

-- Seguridad: los niños no tienen cuenta, la app usa la clave anónima.
-- Solo pueden leer y registrar misiones; no pueden borrar ni editar.
alter table ninos enable row level security;
alter table misiones enable row level security;
alter table completados enable row level security;

create policy "lectura ninos" on ninos for select to anon using (true);
create policy "lectura misiones" on misiones for select to anon using (true);
create policy "lectura completados" on completados for select to anon using (true);
create policy "registrar completados" on completados for insert to anon with check (true);
-- Permite deshacer una misión marcada por error (ventana de ±1 día por diferencias de zona horaria)
create policy "borrar completados recientes" on completados for delete to anon
  using (fecha between current_date - 1 and current_date + 1);

-- Bucket para fotos de prueba
insert into storage.buckets (id, name, public)
values ('pruebas', 'pruebas', true)
on conflict (id) do nothing;

create policy "subir pruebas" on storage.objects for insert to anon
  with check (bucket_id = 'pruebas');
create policy "ver pruebas" on storage.objects for select to anon
  using (bucket_id = 'pruebas');

-- Datos iniciales
insert into ninos (nombre, color, avatar) values
  ('Frank', '#00e5ff', '🦖'),
  ('Valentina', '#ff3d7f', '🦄')
on conflict do nothing;

insert into misiones (nombre, emoji, descripcion, xp, requiere_foto, orden) values
  ('Ducha Turbo', '🚿', 'Bañarte y dejar el baño listo', 20, false, 1),
  ('Uniforme Listo', '👕', 'Organizar el uniforme para mañana', 15, true, 2),
  ('Zapatos Relucientes', '👟', 'Limpiar y secar los zapatos', 15, true, 3),
  ('Laboratorio de Tablas', '📚', 'Repasar las tablas de multiplicar', 25, false, 4),
  ('Misión Loza', '🍽️', 'Lavar la loza y dejarla escurrida', 20, true, 5),
  ('Cama Maestra', '🛏️', 'Tender la cama como nunca', 10, false, 6)
on conflict do nothing;
