-- =====================================================
-- MIGRACION: Sistema de Autenticacion con Roles
-- Ejecutar en Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. CREAR TABLA DE PERFILES DE USUARIO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'registrador' CHECK (role IN ('registrador', 'gerencia')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- 2. HABILITAR RLS EN USER_PROFILES
-- =====================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Politica: usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- 3. MODIFICAR TABLA GASTOS - AGREGAR COLUMNAS
-- =====================================================
-- Agregar user_id para relacionar gastos con usuarios
ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Agregar columnas EERR y OP
ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS eerr BOOLEAN DEFAULT FALSE;

ALTER TABLE public.gastos
  ADD COLUMN IF NOT EXISTS op BOOLEAN DEFAULT FALSE;

-- Indice para filtrar gastos por usuario
CREATE INDEX IF NOT EXISTS idx_gastos_user_id ON public.gastos(user_id);

-- 4. HABILITAR RLS EN GASTOS
-- =====================================================
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;

-- 5. FUNCION HELPER PARA OBTENER ROL
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- 6. POLITICAS RLS PARA GASTOS
-- =====================================================

-- SELECT: registrador ve solo sus gastos, gerencia ve todos
CREATE POLICY "Select gastos by role" ON public.gastos
  FOR SELECT USING (
    CASE
      WHEN public.get_user_role() = 'gerencia' THEN TRUE
      ELSE user_id = auth.uid()
    END
  );

-- INSERT: cualquier usuario autenticado puede crear gastos
CREATE POLICY "Insert gastos authenticated" ON public.gastos
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: gerencia puede actualizar cualquier gasto, registrador solo los suyos
CREATE POLICY "Update gastos by role" ON public.gastos
  FOR UPDATE USING (
    CASE
      WHEN public.get_user_role() = 'gerencia' THEN TRUE
      ELSE user_id = auth.uid()
    END
  );

-- DELETE: solo gerencia puede eliminar
CREATE POLICY "Delete gastos gerencia only" ON public.gastos
  FOR DELETE USING (public.get_user_role() = 'gerencia');

-- 7. TRIGGER PARA ASIGNAR USER_ID AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION public.set_gasto_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe y recrearlo
DROP TRIGGER IF EXISTS trigger_set_gasto_user_id ON public.gastos;

CREATE TRIGGER trigger_set_gasto_user_id
  BEFORE INSERT ON public.gastos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_gasto_user_id();

-- =====================================================
-- FIN DE LA MIGRACION
-- =====================================================

-- NOTA: Despues de ejecutar este script, crea usuarios asi:
--
-- 1. Ve a Supabase Dashboard > Authentication > Users
-- 2. Click "Add user" > "Create new user"
-- 3. Ingresa email y password
-- 4. Copia el UUID del usuario creado
-- 5. Ejecuta en SQL Editor:
--
-- INSERT INTO public.user_profiles (id, email, full_name, role)
-- VALUES (
--   'uuid-del-usuario',
--   'email@ejemplo.com',
--   'Nombre Completo',
--   'gerencia'  -- o 'registrador'
-- );
