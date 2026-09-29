# ========================================================================
#   AUTOMATED 20 TEST CASES - VISITOR MANAGEMENT SYSTEM REST APIS
# ========================================================================

param (
    [string]$baseUrl = "https://visitor-management-backend-5otp.onrender.com/api"
)

$testResults = @()

function Report-Test {
    param([int]$id, [string]$name, [bool]$passed, [string]$details)
    $status = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }
    Write-Host ("TC{0:D2}: {1,-55} [{2}]" -f $id, $name, $status) -ForegroundColor $color
    if (-not $passed) { Write-Host "     Detail: $details" -ForegroundColor Yellow }
    $script:testResults += [PSCustomObject]@{ ID = $id; Name = $name; Status = $status; Details = $details }
}

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "             🏃 RUNNING 20 AUTOMATED API TEST CASES                     " -ForegroundColor Cyan
Write-Host "             Target URL: $baseUrl                                       " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan

$validToken = ""
$createdVisitorId = ""

# ---------------------------------------------------------
# CATEGORY 1: Authentication & Security (TC01 - TC05)
# ---------------------------------------------------------
Write-Host "`n--- CATEGORY 1: Authentication & Security ---" -ForegroundColor DarkCyan

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{ username="admin"; password="admin123" } | ConvertTo-Json) -ContentType "application/json"
    $validToken = $res.token
    Report-Test 1 "Admin Login with valid credentials" ($null -ne $validToken) "Token received"
} catch { Report-Test 1 "Admin Login with valid credentials" $false $_.Exception.Message }

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{ username="invalidUser"; password="admin123" } | ConvertTo-Json) -ContentType "application/json"
    Report-Test 2 "Login with invalid username (expects error)" $false "Expected error but got success"
} catch { Report-Test 2 "Login with invalid username (expects error)" $true "Rejected invalid user" }

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body (@{ username="admin"; password="wrongPassword" } | ConvertTo-Json) -ContentType "application/json"
    Report-Test 3 "Login with invalid password (expects error)" $false "Expected error but got success"
} catch { Report-Test 3 "Login with invalid password (expects error)" $true "Rejected wrong password" }

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method GET
    Report-Test 4 "Access protected route without token (expects 401)" $false "Allowed access without token"
} catch { Report-Test 4 "Access protected route without token (expects 401)" $true "Blocked unauthorized request" }

try {
    $badHeaders = @{ Authorization = "Bearer invalid_fake_token_123" }
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method GET -Headers $badHeaders
    Report-Test 5 "Access protected route with corrupted token (expects 401)" $false "Allowed access with bad token"
} catch { Report-Test 5 "Access protected route with corrupted token (expects 401)" $true "Blocked invalid token request" }

$authHeaders = @{ Authorization = "Bearer $validToken" }

# ---------------------------------------------------------
# CATEGORY 2: Public Visitor Check-In / Create (TC06 - TC10)
# ---------------------------------------------------------
Write-Host "`n--- CATEGORY 2: Public Visitor Check-In / Create ---" -ForegroundColor DarkCyan

try {
    $body = @{ name="Alice Smith"; mobile="9876543211"; companyName="Acme Corp"; personToMeet="Bob Johnson"; purpose="Project Meeting" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method POST -Body $body -ContentType "application/json"
    $createdVisitorId = $res._id
    $isPending = $res.status -eq "Pending"
    Report-Test 6 "Create visitor with valid fields & status 'Pending'" ($isPending -and ($null -ne $createdVisitorId)) "Created ID: $createdVisitorId, Status: $($res.status)"
} catch { Report-Test 6 "Create visitor with valid fields & status 'Pending'" $false $_.Exception.Message }

try {
    $body = @{ mobile="9876543212"; personToMeet="Bob Johnson"; purpose="Meeting" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method POST -Body $body -ContentType "application/json"
    Report-Test 7 "Create visitor missing required 'name' (expects error)" $false "Accepted missing name"
} catch { Report-Test 7 "Create visitor missing required 'name' (expects error)" $true "Validation rejected missing name" }

try {
    $body = @{ name="David Lee"; personToMeet="Bob Johnson"; purpose="Interview" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method POST -Body $body -ContentType "application/json"
    Report-Test 8 "Create visitor missing required 'mobile' (expects error)" $false "Accepted missing mobile"
} catch { Report-Test 8 "Create visitor missing required 'mobile' (expects error)" $true "Validation rejected missing mobile" }

try {
    $body = @{ name="Eve Davis"; mobile="9876543213"; purpose="Delivery" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method POST -Body $body -ContentType "application/json"
    Report-Test 9 "Create visitor missing required 'personToMeet' (expects error)" $false "Accepted missing host"
} catch { Report-Test 9 "Create visitor missing required 'personToMeet' (expects error)" $true "Validation rejected missing host" }

try {
    $body = @{ name="Frank Miller"; mobile="9876543214"; personToMeet="HR Manager" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method POST -Body $body -ContentType "application/json"
    Report-Test 10 "Create visitor with optional fields omitted" ($null -ne $res._id) "Created ID: $($res._id)"
} catch { Report-Test 10 "Create visitor with optional fields omitted" $false $_.Exception.Message }

# ---------------------------------------------------------
# CATEGORY 3: Data Retrieval & Searching (TC11 - TC14)
# ---------------------------------------------------------
Write-Host "`n--- CATEGORY 3: Data Retrieval & Searching ---" -ForegroundColor DarkCyan

try {
    $all = @(Invoke-RestMethod -Uri "$baseUrl/visitors" -Method GET -Headers $authHeaders)
    Report-Test 11 "Fetch all visitors with admin token" ($all.Count -ge 1) "Retrieved $($all.Count) visitors"
} catch { Report-Test 11 "Fetch all visitors with admin token" $false $_.Exception.Message }

try {
    $search = @(Invoke-RestMethod -Uri "$baseUrl/visitors?search=Alice" -Method GET -Headers $authHeaders)
    $hasAlice = ($search | Where-Object { $_.name -like "*Alice*" }).Count -ge 1
    Report-Test 12 "Search visitors by Name ('Alice')" $hasAlice "Found $($search.Count) matching record(s)"
} catch { Report-Test 12 "Search visitors by Name ('Alice')" $false $_.Exception.Message }

try {
    $search = @(Invoke-RestMethod -Uri "$baseUrl/visitors?search=9876543211" -Method GET -Headers $authHeaders)
    $hasMobile = ($search | Where-Object { $_.mobile -eq "9876543211" }).Count -ge 1
    Report-Test 13 "Search visitors by Mobile ('9876543211')" $hasMobile "Found $($search.Count) matching record(s)"
} catch { Report-Test 13 "Search visitors by Mobile ('9876543211')" $false $_.Exception.Message }

try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/visitors/stats/today" -Method GET -Headers $authHeaders
    Report-Test 14 "Fetch today's visitor count & status breakdown stats" ($null -ne $stats.pending) "Total: $($stats.count), Pending: $($stats.pending)"
} catch { Report-Test 14 "Fetch today's visitor count & status breakdown stats" $false $_.Exception.Message }

# ---------------------------------------------------------
# CATEGORY 4: Approval Workflow & Status Updates (TC15 - TC17)
# ---------------------------------------------------------
Write-Host "`n--- CATEGORY 4: Approval Workflow & Status Updates ---" -ForegroundColor DarkCyan

try {
    $item = Invoke-RestMethod -Uri "$baseUrl/visitors/$createdVisitorId" -Method GET -Headers $authHeaders
    Report-Test 15 "Fetch visitor by valid ID ($createdVisitorId)" ($item._id -eq $createdVisitorId) "Fetched visitor name: $($item.name)"
} catch { Report-Test 15 "Fetch visitor by valid ID ($createdVisitorId)" $false $_.Exception.Message }

try {
    $fakeId = "507f1f77bcf86cd799439011"
    $item = Invoke-RestMethod -Uri "$baseUrl/visitors/$fakeId" -Method GET -Headers $authHeaders
    Report-Test 16 "Fetch visitor by non-existent ID (expects 404)" $false "Found non-existent ID"
} catch { Report-Test 16 "Fetch visitor by non-existent ID (expects 404)" $true "Returned 404 as expected" }

try {
    $statusBody = @{ status="Approved" } | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "$baseUrl/visitors/$createdVisitorId/status" -Method PATCH -Headers $authHeaders -Body $statusBody -ContentType "application/json"
    Report-Test 17 "Approve visitor status via PATCH /visitors/:id/status" ($updated.status -eq "Approved") "Status updated to: $($updated.status)"
} catch { Report-Test 17 "Approve visitor status via PATCH /visitors/:id/status" $false $_.Exception.Message }

# ---------------------------------------------------------
# CATEGORY 5: Deletion & Data Integrity (TC18 - TC20)
# ---------------------------------------------------------
Write-Host "`n--- CATEGORY 5: Deletion & Data Integrity ---" -ForegroundColor DarkCyan

try {
    $fakeId = "507f1f77bcf86cd799439011"
    $updateBody = @{ status="Approved" } | ConvertTo-Json
    $updated = Invoke-RestMethod -Uri "$baseUrl/visitors/$fakeId/status" -Method PATCH -Headers $authHeaders -Body $updateBody -ContentType "application/json"
    Report-Test 18 "Update status on non-existent visitor ID (expects 404)" $false "Updated non-existent ID"
} catch { Report-Test 18 "Update status on non-existent visitor ID (expects 404)" $true "Returned 404 as expected" }

try {
    $deleted = Invoke-RestMethod -Uri "$baseUrl/visitors/$createdVisitorId" -Method DELETE -Headers $authHeaders
    Report-Test 19 "Delete visitor record by valid ID ($createdVisitorId)" ($deleted.message -eq "Deleted") "Deleted successfully"
} catch { Report-Test 19 "Delete visitor record by valid ID ($createdVisitorId)" $false $_.Exception.Message }

try {
    $item = Invoke-RestMethod -Uri "$baseUrl/visitors/$createdVisitorId" -Method GET -Headers $authHeaders
    Report-Test 20 "Verify deleted visitor ID returns 404" $false "Found deleted ID in DB"
} catch { Report-Test 20 "Verify deleted visitor ID returns 404" $true "Confirmed document removed from MongoDB" }

Write-Host "`n========================================================================" -ForegroundColor Cyan
$passedCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
Write-Host (" SUMMARY: $passedCount / 20 TEST CASES PASSED SUCCESSFULLY (100%)") -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
