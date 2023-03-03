import type { MetaSysProps } from 'contentful-management'

const sysLink = ({ linkType = 'Entry' }) => ({
  sys: {
    type: 'Link',
    linkType: 'Entry',
    id: 'dummyId',
  },
})

export const createDummyMetaSysProps = ({
  id = 'dummyId',
  type = 'Entry',
  published = true,
  archived = false,
  deleted = false,
}): MetaSysProps => {
  const base = {
    type,
    id,
    version: 1,
    createdBy: sysLink({ linkType: 'User' }),
    createdAt: '2021-05-05T12:00:00.000Z',
    updatedBy: sysLink({ linkType: 'User' }),
    updatedAt: '2021-05-05T12:00:00.000Z',
    space: sysLink({ linkType: 'Space' }),
    status: sysLink({ linkType: 'Status' }),
    environment: sysLink({ linkType: 'Environment' }),
  } as MetaSysProps

  if (published) {
    return {
      ...base,
      publishedVersion: 1,
    }
  }

  if (archived) {
    return {
      ...base,
      archivedVersion: 1,
      archivedBy: sysLink({ linkType: 'User' }),
      archivedAt: '2021-05-05T12:00:00.000Z',
    }
  }

  if (deleted) {
    return {
      ...base,
      deletedVersion: 1,
      deletedBy: sysLink({ linkType: 'User' }),
    }
  }

  return base
}
