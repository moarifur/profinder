// fetch(`https://api.github.com/users/moarifur`).then(result => result.json()).then(profile => console.log(profile))
// ------------------------------------------------------------------------------------------------------------------

// async function getUser() {
//     const response = await fetch(`https://api.github.com/users/moarifur`)
//     const profile = await response.json()
//     return profile
// }
// console.log(getUser())

// ----------------------------- Get 5000 user call per hour by fetching user API -------------------------------------------
// Client ID: f092605018421287a187
// client secrets: 18bf05fb1d726674505b3cae7fd2cc4984de345e
const CLIENT_ID = "f092605018421287a187";
const CLIENT_SECRET = "18bf05fb1d726674505b3cae7fd2cc4984de345e";
async function getUser(name) {
  const response = await fetch(`https://api.github.com/users/${name}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)
  const profile = await response.json();
  return profile
}

// ------------------------------- Get repository info by fetching repository API --------------------------------------------
async function getRepos(profile) {
  const response = await fetch(`${profile.repos_url}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`)
  const repo = await response.json();
  return repo
}

// ------------------------------------------------------------------------------------------------------------------
document.querySelector("#search").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.querySelector("#findByUsername").value
    // console.log(username)
    if (username.length > 0) {
        document.querySelector('.loader').style.display = 'flex'
        document.querySelector('.user-details').style.display = 'none'
        document.querySelector('.notFound').style.display = 'none'
        const profile = await getUser(username)
        // console.log(profile)
        document.querySelector('.loader').style.display = 'none'
        if (profile.message === 'Not Found') {
            document.querySelector('.notFound').style.display = 'flex'
        } else {
            document.querySelector('.user-details').style.display = 'flex'
            const repos = await getRepos(profile)
            // console.log(repos)
            showProfile(profile)
            showRepos(repos)
        }
        document.querySelector("#findByUsername").value = ''
    }
});

/* ---------------------------- Show user profile -----------
<img
    src="https://avatars3.githubusercontent.com/u/47313?s=400&u=7ba05204271a726f8642ac15864e2f361b5c0198&v=4"
    alt="letstrie"
    />
    <p class="name">Fabien Potencier</p>
    <p class="username login">fabpot</p>
    <p class="bio">Simplifying things for fun</p>
    <div class="followers-stars">
        <p>
            <ion-icon name="people-outline"></ion-icon>
            <span class="followers"> 10 </span> followers
        </p>
        <span class="dot">·</span>
        <p><span class="following"> 20 </span> following</p>
---------------------------------------- */
// inerHTML: A bad practice
function showProfile(profile) {
    document.querySelector(".profile").innerHTML = `
    <img
        src="${profile.avatar_url}"
        alt="${profile.name}"
    />
    <p class="name">${profile.name}</p>
    <p class="username login">${profile.login}</p>
    <p class="bio">${profile.bio}</p>
    
    <div class="followers-stars">
        <p>
            <ion-icon name="people-outline"></ion-icon>
            <span class="followers"> ${profile.followers} </span> followers
        </p>
        <span class="dot">·</span>
        <p>
            <span class="following"> ${profile.following} </span> following
        </p>
    </div>

    <p class="company">
        <ion-icon name="business-outline"></ion-icon>
        ${profile.company}
    </p>
    <p class="location">
        <ion-icon name="location-outline"></ion-icon>
        ${profile.location}
    </p>               
`
}

//----------------------------- Show user repository ---------------------------

function showRepos(repos) {
    let newHtml = ''
    for (const repo of repos) {
        newHtml += `
            <div class="repo">
                <div class="repo_name">
                    <a href="${repo.html_url}">${repo.name}</a>
                </div>
                <p>
                    <span class="circle"></span> ${repo.language}
                    <ion-icon name="star-outline"></ion-icon> ${repo.watchers_count}
                    <ion-icon name="git-branch-outline"></ion-icon> ${repo.forks_count}
                </p>
            </div>
        `
    }
    document.querySelector(".repos").innerHTML = newHtml
}