export type ChatgptSub2ApiScope = 'selected' | 'registered'

export type ChatgptSub2ApiBatchBody = {
  params: Record<string, never>
  account_ids?: number[]
  all_filtered?: true
  status?: 'registered'
  email?: string
}

function normalizeSelectedAccountIds(selectedRowKeys: readonly (string | number)[]): number[] {
  const accountIds: number[] = []
  const seen = new Set<number>()

  for (const rawValue of selectedRowKeys) {
    const accountId = Number(rawValue)
    if (!Number.isInteger(accountId) || accountId <= 0 || seen.has(accountId)) {
      continue
    }
    seen.add(accountId)
    accountIds.push(accountId)
  }

  return accountIds
}

export function getChatgptSub2ApiScope(selectedCount: number): ChatgptSub2ApiScope {
  return selectedCount > 0 ? 'selected' : 'registered'
}

export function buildChatgptSub2ApiButtonLabel(selectedCount: number): string {
  return selectedCount > 0 ? `上传所选到 Sub2API (${selectedCount})` : '上传已注册到 Sub2API'
}

export function buildChatgptSub2ApiConfirmText(selectedCount: number, search: string): string {
  if (selectedCount > 0) {
    return `确认上传所选 ${selectedCount} 个账号到 Sub2API？`
  }

  return String(search || '').trim()
    ? '确认上传当前搜索结果中状态为“已注册”的账号到 Sub2API？'
    : '确认一键上传全部“已注册”账号到 Sub2API？'
}

export function buildChatgptSub2ApiBatchBody({
  selectedRowKeys,
  search,
}: {
  selectedRowKeys: readonly (string | number)[]
  search: string
}): ChatgptSub2ApiBatchBody {
  const accountIds = normalizeSelectedAccountIds(selectedRowKeys)
  if (accountIds.length > 0) {
    return {
      params: {},
      account_ids: accountIds,
    }
  }

  const body: ChatgptSub2ApiBatchBody = {
    params: {},
    all_filtered: true,
    status: 'registered',
  }

  const email = String(search || '').trim()
  if (email) {
    body.email = email
  }

  return body
}
