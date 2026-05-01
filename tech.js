// Tech tag configuration
const techConfig = {
    react: {
        name: 'React',
        color: '#61dafb88',
        icon: 'images/icons/react-48.png'
    },
    nodejs: {
        name: 'NodeJS',
        color: '#33993388',
        icon: 'images/icons/node-js-48.png'
    },
    mongodb: {
        name: 'MongoDB',
        color: '#47A24888',
        icon: 'images/icons/mongo-db-48.png'
    },
    javascript: {
        name: 'JavaScript',
        color: '#F7DF1E88',
        icon: 'images/icons/javascript-48.png'
    },
    css: {
        name: 'CSS',
        color: '#1572B688',
        icon: 'images/icons/css-logo-48.png'
    },
    html: {
        name: 'HTML5',
        color: '#f4242488',
        icon: 'images/icons/html-5-48.png'
    },
    python: {
        name: 'Python',
        color: '#508de988',
        icon: 'images/icons/python-48.png'
    },
    express: {
        name: 'ExpressJS',
        color: '#ffffff88',
        icon: 'images/icons/express-js-48.png'
    },
    tailwind: {
        name: 'Tailwind css',
        color: '#499ee988',
        icon: 'images/icons/tailwind-css-48.png'
    }
};


function createTechTag(techKey) {
    const tech = techConfig[techKey];
    if (!tech) return '';
    
    return `
        <span class="tech-tag" style="--tag-color: ${tech.color}">
            <img class="tech-icon" src="${tech.icon}">
            <span class="tech-name">${tech.name}</span>
        </span>
    `;
}

// Create multiple tags
function createTechTags(techArray) {
    return techArray.map(tech => createTechTag(tech)).join('');
}