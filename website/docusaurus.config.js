/**
 * Copyright © 2020 Mr.Hanson.
 *
 */

const version = require('../package.json').version

module.exports = {
  title: 'React Listview',
  tagline: 'Gennerate listview layout based on AntD & React hooks & Typescript',
  url: 'https://mrhanson.github.io/react-listview',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'MrHanson', // Usually your GitHub org/user name.
  projectName: 'react-listview', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: `React Listview V${version}`,
      links: [
        { to: 'docs/description', label: 'Docs', position: 'left' },
        // Please keep GitHub link to the right for consistency.
        {
          href: 'https://github.com/MrHanson/react-listview',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: []
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Feedback',
              href: 'https://github.com/MrHanson/react-listview/issues'
            }
          ]
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MrHanson/react-listview'
            }
          ]
        }
      ],
      copyright: `Copyright © 2020 Mr.Hanson`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/mrhanson/react-listview/edit/master/website/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
