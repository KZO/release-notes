# kzo-release-notes
Generates KZO release notes automatically based on our GitHub conventions

It's pretty simple: install this package globally, then run it in the root of the repo you wish to generate release notes for.  It will automatically figure out which repo it's in, pull all closed tickets for the milestone requested, and generate a PDF.

## Getting started:

To start, install the application globally:

```
npm install kzo-release-notes -g
```

#### Using github tokens:
In order to generate release notes for private repositories, you'll need to supply a Github token.  You can do this via environment variables:
```
$ GITHUB_TOKEN=XXXXX kzo-release-notes -m 5.13.1 -w
```

Or even easier is to just save the following line to your `~/.bashrc` / `~/.zshrc` profile, so you never have to remember it again:`export GITHUB_TOKEN="XXXXX"`


## Usage examples:
```
kzo-release-notes --milestone 5.13.1 -w
```

### More options:
```
$ kzo-release-notes --help

  Usage: release-notes [options]

  Options:

    -h, --help                  output usage information
    -m, --milestone <label>     Milestone name (e.g.: 4.0.1)
    -w, --write [filename]      Converts to PDF and writes to disk instead of markdown => stdout  (Default filename: Release-vMILESTONE.pdf)
    -s, --status <closed|open>  Show milestones where the status is open or closed.  (Default: closed)
    -r, --repo <reponame>       Search milestones belonging to this repo (Defaults to lookup of origin server in current git repo)
    -u, --user <username>       Specify User or Org repo belongs to (defaults to lookup of origin server in current git repo)
    -t, --template <template>   Location of mustache template file
