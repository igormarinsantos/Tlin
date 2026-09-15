# API Coverage — Deskcomm capture and commercial-status boundary

> Full coverage by default for the Deskcomm surface used by this phase. Opt-outs are explicit and reasoned.

| capability | decision | reason |
|---|---|---|
| Inbound capture webhook: create or update contact/lead | INTEGRATE | creates the operational lead when a valid WhatsApp is captured |
| Inbound capture webhook: map acquisition, form and qualification metadata | INTEGRATE | preserves first/last touch and SDR-gamified context in the CRM record |
| Idempotent capture | INTEGRATE | browser retries and repeated submits must not duplicate the operational lead |
| CRM lead/contact identifier in response | INTEGRATE | correlation key for scheduling, backup and later commercial attribution |
| CRM stage update for `em_qualificacao`, `a_desenvolver` and `qualificado` | INTEGRATE | the CRM owns qualification state after capture |
| MCP availability lookup | INTEGRATE | existing demo calendar stays linked to the CRM agenda |
| MCP appointment booking | INTEGRATE | an eligible lead can book the closer in the same operational record |
| Outbound CRM event for stage changes | INTEGRATE | mirrors later demo/qualification/sale status into backup data without making it authoritative |
| Contact search as post-webhook polling | OPT-OUT | replace the current race-prone lookup when the capture contract returns the CRM identifier; retain only as documented compatibility fallback if the instance cannot return it |
| CRM messaging/WhatsApp delivery | OPT-OUT | configuration and copy for nurture are CRM automation work; this phase only provides the correct lead/stage input |
| CRM pipeline, user, tenant and permission administration | OPT-OUT | operational administration is outside the landing repository |
| CRM reporting UI | OPT-OUT | Fernando's reporting system is a deferred consumer of the same status contract |
