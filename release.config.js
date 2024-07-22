const branch = process.env.BRANCH_NAME

const config = {
  branches: ['main', { name: 'develop', prerelease: 'rfv' }, '+([0-9])?(.{+([0-9]),x}).x'],
  plugins: [['@semantic-release/commit-analyzer',
  {
    releaseRules: [
      {
        type: "refactor",
        release: "patch",
      },
    ],
  },
], 
  ['@semantic-release/release-notes-generator',
  {
    presetConfig: {
      types: [
        {
          type: "refactor",
          section: "Refactors",
          hidden: false,
        },
      ],
    },
  }],
  [
    "@semantic-release/exec",
    {
      prepareCmd: "zip -r -qq presidium-js dist && printf '${nextRelease.version}' > VERSION",
    },
  ],
  [
    '@semantic-release/github',
    {
      "assets": [
      { "path": "presidium-js.zip", "name":"${nextRelease.gitTag}.zip", "label": "${nextRelease.gitTag}.zip" }
    ]
  }],
]}

if (branch == 'main') {
  config.plugins.push(['@semantic-release/changelog',
    {
      changelogFile: "CHANGELOG.md",
    },
  ],
  ['@semantic-release/git',
    {
      assets: ['CHANGELOG.md', 'VERSION'],
    },
  ])
} else {
  config.plugins.push(['@semantic-release/git',
    {
      assets: ['VERSION'],
    },
  ])
}

module.exports = config
