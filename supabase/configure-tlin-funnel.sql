-- Verified against the tlin.ai organization in Deskcomm on 2026-09-17.
-- Apply after 20260917_funnel_reliability.sql. Score never writes this mapping.
insert into public.funnel_stage_mapping(stage_id,label,qualified,attended,won) values
  ('a368d74e-6ec3-4857-ae33-b0324227f956','Qualificação confirmada',true,false,false),
  ('81e5205c-3c13-45f7-9625-54cb19bdc268','Não qualificado',false,false,false),
  ('4b2383ac-6dcc-4830-92fb-e94c4d8919ec','Call realizada',null,true,false),
  ('81ba8aad-e311-4bc5-a28c-8c93bd512485','Ganho',null,false,true)
on conflict(stage_id) do update set label=excluded.label,qualified=excluded.qualified,attended=excluded.attended,won=excluded.won;
