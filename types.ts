export type FalcoAlert = {
  output: string,
  priority: string,
  rule: string,
  time: string,
  source: string,
  tags: string[],
  output_fields: {
    user: string,
    process_name: string,
    file: string,
    container_id: string
  }
}

