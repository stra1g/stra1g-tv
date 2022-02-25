export default {
  role: {
    name: 'admin',
    description: 'Master admin',
  },
  permissions: [
    {
      name: 'store_*',
      description: 'Store anything',
    },
    {
      name: 'update_*',
      description: 'Update anything',
    },
    {
      name: 'destroy_*',
      description: 'Destroy anything',
    },
    {
      name: 'show_*',
      description: 'Show anything',
    },
    {
      name: 'index_*',
      description: 'Index anything',
    },
  ],
};
