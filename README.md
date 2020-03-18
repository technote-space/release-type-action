# Release Type Action

[![CI Status](https://github.com/technote-space/release-type-action/workflows/CI/badge.svg)](https://github.com/technote-space/release-type-action/actions)
[![codecov](https://codecov.io/gh/technote-space/release-type-action/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/release-type-action)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/release-type-action/badge)](https://www.codefactor.io/repository/github/technote-space/release-type-action)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/release-type-action/blob/master/LICENSE)

GitHub Actions to do some actions based on release type.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Actions](#actions)
  - [Set title](#set-title)
  - [Set label](#set-label)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
```yaml
on: pull_request

name: Manage release

jobs:
  manageRelease:
    runs-on: ubuntu-latest
    steps:
      - uses: technote-space/release-type-action@v1
```

## Actions
### Set title
e.g. `release: v1.2.3`

### Set label
- Release: Major
- Release: Minor
- Release: Patch

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
