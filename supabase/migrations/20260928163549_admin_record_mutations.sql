create policy clients_admin_delete on public.clients
  for delete to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy invoices_admin_delete on public.invoices
  for delete to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

create policy contracts_admin_delete on public.contracts
  for delete to authenticated
  using (exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  ));

grant delete on public.clients to authenticated;
grant delete on public.invoices to authenticated;
grant delete on public.contracts to authenticated;
