# /backend/app/services/validators.py

import re
from fastapi import HTTPException

# A comprehensive list of regex patterns we refuse to accept in the user’s prompt.
FORBIDDEN_PATTERNS = [
    # ==== Prompt Injection / LLM-specific attacks ====
    r"ignore\s+previous\s+instructions",         # classic “ignore previous instructions”
    r"forget\s+all\s+instructions",               # another variant
    r"system\s*prompt",                          # requesting internal/system prompt
    r"gemini_api_key",                           # exposing or asking for API keys
    r"your\s+name\s+is",                         # attempts to extract model identity
    r"tell\s+me\s+everything\s+you\s+know",      # broad “jailbreak” attempts

    # ==== Cross‐Site Scripting (XSS) & HTML/JS Injection ====
    r"</?script>",                               # <script> or </script>
    r"javascript\s*:",                           # javascript: URI scheme
    r"on\w+\s*=",                                # inline event handlers like onload=, onclick=
    r"<\s*iframe",                               # <iframe> tags
    r"<\s*object",                               # <object> tags
    r"<\s*embed",                                # <embed> tags
    r"<\s*svg",                                  # <svg> tags (could embed scripts)
    r"<\s*img[^>]+on\w+\s*=",                     # <img onerror=>, <img onload=>
    r"<\s*video[^>]+on\w+\s*=",                   # <video onerror=, onload= etc.
    r"<\s*body[^>]+on\w+\s*=",
    r"document\.cookie",                         # attempts to read cookies
    r"document\.location",                       # attempts to redirect
    r"window\.location",                         # attempts to redirect
    r"eval\s*\(",                                # eval() call
    r"setTimeout\s*\(",                          # JS timeout injection
    r"setInterval\s*\(",                         # JS interval injection
    r"fetch\s*\(",                               # fetch() usage
    r"XMLHttpRequest",                           # XHR attempts

    # ==== Template Injection / Server-Side Injection ====
    r"\{\{.*\}\}",                               # handlebars/jinja-like double curly braces
    r"\[\[.*\]\]",                               # other templating syntax
    r"<%\s*.*\s*%>",                             # ASP/JSP-like
    r"\$\{.*\}",                                 # shell or template injection via ${...}
    r"%\{.*\}",                                  # another template injection pattern

    # ==== SQL Injection Patterns ====
    r"(\b)(select|insert|update|delete|drop|alter|create|exec|union|grant|revoke)\b", 
    r"'(\s*or\s*|\s*and\s*)(\d+|\'.*\')=('\d+'|\d+)",  # ' OR 1=1
    r"(--|\#)[^\n]*",                            # SQL comment “-- ” or “#”
    r"(/\*.*\*/)",                               # SQL block comments
    r"';\s*(drop|truncate|delete)\s+table",      # '; DROP TABLE
    r"'\s*or\s*1=1\s*--",                        # ' or 1=1 --
    r"admin'--",                                 # admin'--
    r"xp_cmdshell",                              # MSSQL shell execution
    r"information_schema",                       # querying meta tables
    r"benchmark\s*\(",                           # MySQL benchmark()
    r"sleep\s*\(",                               # sleep() delays

    # ==== Command Injection / Shell Metacharacters ====
    r";\s*(ls|cat|whoami|uname|rm|mv|cp|chmod|chown)\b", 
    r"\|\|\s*",                                  # || operator chaining
    r"\|\s*(ls|cat|ps|kill|netstat)\b",          # | ls, | ps etc.
    r"&\s*(ping|wget|curl|nc|netcat)\b",         # & ping, & wget etc.
    r"\$(\(\s*.*\s*\)|[a-zA-Z_]\w*)",             # $(...) or $VAR
    r"`.*`",                                     # backtick execution
    r"<\s*\(.*\)",                               # <( ) process substitution
    r"\bsh\b|\bbash\b|\bpython\b|\bread\b|\bmore\b", # explicit shell commands
    r"\b/etc/passwd\b|\b/etc/shadow\b",          # attempts to read system files

    # ==== Path Traversal / File Inclusion ====
    r"\.\./",                                    # ../
    r"\.\.\\",                                   # ..\
    r"\/etc\/passwd",                            # /etc/passwd
    r"\/etc\/shadow",                            # /etc/shadow
    r"\\\\localhost\\\\",                        # \\localhost\\ (Windows UNC)
    r"c:\\windows\\system32",                    # Windows system folder
    r"phar:\/\/",                                # PHP archive wrapper

    # ==== Network Scanning / LFI / RFI ====
    r"(http|https|ftp):\/\/[^\s]+",              # any URL attempt
    r"file:\/\/[^\s]+",                          # file:// URIs
    r"data:text\/html",                          # data URI for HTML
    r"gopher:\/\/[^\s]+",                        # gopher URI
    r"127\.0\.0\.1",                             # loopback literal
    r"localhost",                                # literal “localhost”
    r"\bping\b",                                 # ping command
    r"\bnmap\b",                                 # nmap scans
    r"\bnetstat\b",                              # netstat info
    r"\bssh\b",                                  # ssh attempt
    r"\bscp\b",                                  # scp attempt

    # ==== Directory/OS Enumeration & Information Disclosure ====
    r"\buname\b",                                # uname command
    r"\bwhoami\b",                               # whoami command
    r"\bifconfig\b|\bipconfig\b",                # network interface command
    r"\bdir\b|\bls\b",                           # directory listing

    # ==== Email / Credentials / Secrets Patterns ====
    r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",  # email address
    r"api[_-]?key\s*[:=]\s*[A-Za-z0-9\-\_]{20,}",       # generic API key patterns
    r"aws[_-]?secret[_-]?access[_-]?key",               # AWS secret access key
    r"-----BEGIN\s+PRIVATE\s+KEY-----",                # Private key header
    r"-----BEGIN\s+RSA\s+PRIVATE\s+KEY-----",          # RSA private key
    r"-----BEGIN\s+CERTIFICATE-----",                  # certificate block
    r"ssh-rsa\s+[A-Za-z0-9+/=]+\s+",                   # SSH public key pattern

    # ==== Java / .NET / Python Serialization / Deserialization Attacks ====
    r"(\b)(eval|exec|pickle|marshal|unserialize|DeserializeObject)\b", 
    r"<\s*\?php",                                 # PHP tags 
    r"<\s*%\s*@\s*page",                          # ASP.NET <%@ Page
    r"System\.IO\.File",                          # .NET file I/O in C# code

    # ==== Miscellaneous Lock‑in / Rerouting / Metadata Exposure ====
    r"\bcurl\b.*(http|https)://",                 # curl command to external URL
    r"\bwget\b.*(http|https)://",                 # wget command
    r"\bbox\b|\btoString\(\)",                    # JS toString/carrier 
    r"\bclass\.getDeclaredMethods\(\)",           # Java reflection
    r"\bjava\.lang",                              # Java package
    r"\bimport\s+java\.",                         # Java import
    r"\bimport\s+os\b|\bimport\s+subprocess\b",    # Python OS/subprocess
    r"&gt;|&lt;|&amp;",                            # HTML-escaped chars (>)
    r"%3C|%3E|%3F",                               # URL-encoded <, >, ?
]

def sanitize_prompt(prompt: str) -> str:
    """
    1) Lowercases the prompt for pattern matching.
    2) If any forbidden pattern is found, immediately reject with 400.
    3) Otherwise, return the original prompt (or a lightly stripped version).
    """
    lowered = prompt.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, lowered):
            raise HTTPException(
                status_code=400,
                detail=f"Prompt contains disallowed pattern: {pattern}"
            )
    # Optionally: strip out control characters
    cleaned = re.sub(r"[\x00-\x1f\x7f]", "", prompt)
    return cleaned