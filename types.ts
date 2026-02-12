export type FalcoAlert = {
  output: string,
  containerid : string,
  containername: string,
  podname: string,
  namespace: string,
  username: string,
  useruid: string,
  priority: string,
  rule: string,
  time: string,
  source: string,
  tags: string[]
}


export type IncidentType = {
  id: string,
  pod: string,
  namespace: string,
  firstSeen: string,
  lastSeen: string,
  severity: string,
  alertCount: number,
  status: "open" | "quarantined" | "deleted"
}