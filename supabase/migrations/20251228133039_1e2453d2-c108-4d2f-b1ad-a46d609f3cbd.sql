-- Drop the vulnerable policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create a new policy that prevents users from changing is_admin
-- Users can only update their own profile AND is_admin must remain unchanged
CREATE POLICY "Users can update own profile except admin flag"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);