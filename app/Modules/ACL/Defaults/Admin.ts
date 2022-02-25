export default {
  role: {
    name: 'admin',
    description: 'Master admin',
  },
  permissions: [
    {
      method: 'store',
      resource: '*',
      description: 'Store anything',
    },
    {
      method: 'update',
      resource: '*',
      description: 'Update anything',
    },
    {
      method: 'destroy',
      resource: '*',
      description: 'Destroy anything',
    },
    {
      method: 'show',
      resource: '*',
      description: 'Show anything',
    },
    {
      method: 'index',
      resource: '*',
      description: 'Index anything',
    },
  ],
};
