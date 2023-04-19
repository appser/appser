export function setLastOrgId(orgId: string) {
  localStorage.setItem('lastOrgId', orgId)
}

export function getLastOrgId() {
  return localStorage.getItem('lastOrgId')
}
