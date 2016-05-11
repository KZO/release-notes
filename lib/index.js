import GitHubApi from 'github';
import program from 'commander';
import Promise from 'bluebird';
import resolveRemote from 'resolve-git-remote';
import hogan from 'hogan.js';


const expressions = ['Whew!', 'Ain\'t that fancy!', 'Woah!', 'Whoo!', 'Awesome!', 'Dude!', 'Holy Cow!', 'Get out of town!', 'No Way!', 'Nice!', 'Sweet!', 'OMG!'];
const remote = Promise.promisify(resolveRemote);

const github = new GitHubApi({ version: '3.0.0' });
const getAllMilestones = Promise.promisify(github.issues.getAllMilestones);
const getRepoIssues = Promise.promisify(github.issues.repoIssues);


async function getMilestoneByTitle ({ title, user, repo, state='closed' } = {}) {
  if (!title) throw new Error('You did not specify a milestone');
  const milestones = await getAllMilestones({
    user, repo, state,
    page: 0,
    per_page: 100
  });

  const milestone = milestones.find(milestone => milestone.title === title);
  if (!milestone) throw new Error(`Could not find the given milestone: ${ title }`);

  return milestone;
}

async function getIssues ({ user, repo, milestoneData } = {}) {
  // allow passing the milestone object from github api response:
  if (typeof milestoneData === 'object') {
    milestoneData = milestoneData.number;
  }

  const issues = await getRepoIssues({
    user, repo, milestoneData,
    state: 'closed',
    per_page: 100
  });

  const bugs = issues.filter(issue => {
    const isBug = issue.labels.find(label => label.name === 'type:bug');
    if (isBug) return issue;
  });
  const features = issues.filter(issue => {
    const isFeature = issue.labels.find(label => label.name === 'type:feature');
    if (isFeature) return issue;
  });
  const improvements = issues.filter(issue => {
    const isImprovement = issue.labels.find(label => label.name === 'type:improvement');
    if (isImprovement) return issue;
  });

  return { bugs, features, improvements };
}

export default async function releaseNotes ({ user, repo, milestone, template, token }) {
  if (token) {
    github.authenticate({
      type: 'oauth',
      token: token
    });
  }

  const milestoneData = await getMilestoneByTitle({ user, repo, title: milestone });
  const issues = await getIssues({ user, repo, milestoneData });

  // generate the markdown:
  issues.bugs.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
  issues.features.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
  issues.improvements.expression = expressions.splice(Math.floor(Math.random() * expressions.length), 1);
  const tmpl = hogan.compile(template);
  const md = tmpl.render({ milestone: milestoneData, issues, repo });
  return md;
};
