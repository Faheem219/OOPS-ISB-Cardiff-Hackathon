# NIST Special Publication 800-218 Revision 1.1  
**Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities**  

**Authors**: Murugiah Souppaya, Karen Scarfone, Donna Dodson  
**Published**: February 2022 :contentReference[oaicite:0]{index=0}  

---

## Executive Summary  
- Defines a core set of **high-level secure software development practices** (the SSDF) to integrate into any SDLC.  
- Aims to **reduce vulnerabilities**, **limit impact** of exploitation, and **prevent recurrence** by addressing root causes.  
- Focuses on **outcomes**, not specific tools or processes, making the SSDF **technology- and methodology-agnostic**.  
- Provides a **common vocabulary** for software producers and acquirers to communicate secure development requirements. :contentReference[oaicite:1]{index=1}  

---

## 1 Introduction  
- **SDLC models** (waterfall, agile, DevOps, etc.) rarely include security by default—security must be **shifted left** to early stages.  
- The SSDF **does not create new practices**, but organizes **established secure-development tasks** into a consistent framework.  
- Intended for **software producers** (vendors, internal teams) and **software acquirers** (federal agencies, enterprises).  
- Encourages a **risk-based, flexible approach**: adopt relevant practices based on context, risk, and maturity. :contentReference[oaicite:2]{index=2}  

---

## 2 The Secure Software Development Framework  
Defines **four practice groups**, each with high-level practices, tasks, and notional implementation examples:

1. **Prepare the Organization (PO)**  
   - Establish security requirements, roles, toolchains, and secure environments for development.  
   - Key practices:  
     - **PO.1** Define and document security requirements for development processes and software.  
     - **PO.2** Implement and train on roles & responsibilities across the SDLC.  
     - **PO.3** Automate and secure toolchains to enforce practices and generate audit artifacts.  
     - **PO.4** Define criteria and metrics for software-security checks.  
     - **PO.5** Segment and harden development environments and endpoints. :contentReference[oaicite:3]{index=3}  

2. **Protect the Software (PS)**  
   - Safeguard code and releases from tampering and unauthorized access.  
   - Key practices:  
     - **PS.1** Store all forms of code under least-privilege controls (source, executables, IaC).  
     - **PS.2** Provide integrity-verification mechanisms (signing, hashes) for releases.  
     - **PS.3** Archive and preserve each release and its provenance data (SBOMs). :contentReference[oaicite:4]{index=4}  

3. **Produce Well-Secured Software (PW)**  
   - Build software that meets security requirements and mitigates risks by design.  
   - Key practices:  
     - **PW.1** Design to requirements: threat modeling, risk analysis, and use of standard security services.  
     - **PW.2** Review designs (manual and automated) to verify compliance and risk mitigation.  
     - **PW.3–PW.6** (continued in full document—reuse secure components, implement secure coding, test for vulnerabilities, maintain tool security) :contentReference[oaicite:5]{index=5}  

4. **Respond to Vulnerabilities (RV)**  
   - Identify residual vulnerabilities post-release and manage them to prevent recurrence.  
   - Key practices (summarized):  
     - **RV.1** Establish processes to receive, track, and prioritize vulnerability reports.  
     - **RV.2** Perform vulnerability triage and root-cause analysis.  
     - **RV.3** Implement fixes, communicate patches, and verify remediation.  
     - **RV.4** Incorporate lessons learned to improve future SDLC practices. :contentReference[oaicite:6]{index=6}  

---

## References & Appendices  
- **References**: Established standards (e.g., ISO 27034, OWASP, NIST SP 800-53, EO 14028 mappings).  
- **Appendix A**: Mapping of SSDF practices to EO 14028 clauses.  
- **Acronyms** (e.g., SDLC, SBOM, PoLP).  
- **Change Log**: Document version history and updates. :contentReference[oaicite:7]{index=7}  

---

## Key Themes  
- **Outcome-focused**: Emphasize “what” to achieve, not “how.”  
- **Flexible & Risk-Based**: Tailor practices to organizational context and risk appetite.  
- **Automation & Auditability**: Integrate toolchains that enforce practices and generate evidence.  
- **Holistic Lifecycle Coverage**: From organizational readiness through development, release, and vulnerability response.  
- **Common Language**: Facilitates clear communication between producers, acquirers, and stakeholders. :contentReference[oaicite:8]{index=8}  
