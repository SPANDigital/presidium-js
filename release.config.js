const branch = process.env.TRAVIS_BRANCH

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
      prepareCmd: "zip -r -qq ${nextRelease.version} dist && printf '${nextRelease.version}' > VERSION",
      successCmd: "TRAVIS_TAG=${nextRelease.gitTag}",
    },
  ],
  [
    '@semantic-release/github',
    {
      "assets": [
      { "path": "presidium-js.zip", "label": "presidium-js.zip" }
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
  ['@semantic-release/git',
    {
      assets: ['VERSION'],
    },
  ]
}

module.exports = config
