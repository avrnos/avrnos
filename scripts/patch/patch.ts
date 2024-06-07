import axios from 'axios';

const GITHUB_TOKEN = 'your_github_token'; // Replace with your GitHub token
const REPO_OWNER = 'repo_owner';
const REPO_NAME = 'repo_name';
const PR_NUMBER = 1; // Replace with your PR number

const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

interface Commit {
  commit: {
    message: string;
    author: {
      name: string;
    };
  };
}

interface PRDetails {
  title: string;
  body: string;
}

async function fetchPRDetails(): Promise<{ prDetails: PRDetails; commits: Commit[] }> {
  try {
    const prResponse = await axios.get(`${GITHUB_API_URL}/pulls/${PR_NUMBER}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const commitsResponse = await axios.get(`${GITHUB_API_URL}/pulls/${PR_NUMBER}/commits`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    return {
      prDetails: prResponse.data,
      commits: commitsResponse.data,
    };
  } catch (error) {
    console.error('Error fetching PR details:', error);
    throw error;
  }
}

async function displayPatch(): Promise<void> {
  const { prDetails, commits } = await fetchPRDetails();

  console.log(`PR Title: ${prDetails.title}`);
  console.log(`PR Body: ${prDetails.body}`);
  console.log('Commits:');

  commits.forEach((commit, index) => {
    console.log(`  ${index + 1}. ${commit.commit.message}`);
    console.log(`     Author: ${commit.commit.author.name}`);
  });
}

displayPatch();
