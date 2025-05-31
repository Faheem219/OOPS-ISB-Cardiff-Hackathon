# SQL Injection Walkthrough

## Overview
SQL Injection is a class of injection vulnerability where an attacker can manipulate backend SQL queries by injecting malicious input. This can lead to unauthorized data access, data modification, or even full system compromise.

## Types of SQL Injection
- **Classic SQL Injection**: Directly injecting into query strings.
- **Blind SQL Injection**: Exploiting vulnerabilities without direct feedback.
  - *Boolean-based*: Determining true/false responses.
  - *Time-based*: Inferring data via deliberate delays.
- **Error-based**: Leveraging database error messages to gather information.

## Example Scenario
A login form uses this query:
```sql
SELECT * FROM users WHERE username = '<input>' AND password = '<password>';
```
If the attacker enters:
- **Username**: `admin' --`
- **Password**: *(anything)*

The query becomes:
```sql
SELECT * FROM users WHERE username = 'admin' --' AND password = '';
```
The `--` comments out the rest, bypassing authentication.

## Step-by-Step Exploitation
1. **Identify injectable parameters**  
   - Test single quotes: `username = 'test'` vs `username = 'test'`.
2. **Confirm vulnerability**  
   - Use payload `' OR 1=1 --` and observe login bypass.
3. **Enumerate database**  
   - Use blind techniques:
     - Boolean: `' AND (SELECT SUBSTRING(@@version,1,1))='5' --`
     - Time-based: `' OR IF(1=1, SLEEP(5), 0) --`
4. **Extract data**  
   - Extract table names: `' UNION SELECT table_name,2 FROM information_schema.tables --`
   - Extract column data similarly.
5. **Automate with tools**  
   - Use sqlmap: `sqlmap -u "http://example.com/login" --dump`

## Prevention Techniques
- **Use Parameterized Queries (Prepared Statements)**  
  ```python
  cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
  ```
- **ORMs and Query Builders**  
  - Django ORM, SQLAlchemy, etc.
- **Input Validation and Whitelisting**  
  - Reject or sanitize suspicious characters.
- **Least Privilege Database Accounts**  
  - Limit account permissions to only necessary operations.
- **WAF and Monitoring**  
  - Deploy Web Application Firewalls to block common payloads.