// Initialize Supabase client
const supabaseUrl = 'https://ugyhwdfusiotzfpvhoek.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneWh3ZGZ1c2lvdHpmcHZob2VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5NTI0NDIsImV4cCI6MjAzNTUyODQ0Mn0.3UqLsciUx1BrGu-3NpiQ1LgY8ynIDoQAznS4j6KbPEU'; // Replace with your Supabase Key
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Function to fetch articles from Supabase
async function fetchArticles() {
    try {
        let { data: articles, error } = await supabaseClient
            .from('articles')
            .select('*');

        if (error) {
            throw error;
        }

        displayArticles(articles);
        createArticlePages(articles); // Generate individual article pages
        updateMenu(articles);
    } catch (error) {
        console.error('Error fetching articles:', error.message);
    }
}

// Function to display articles on the index page
function displayArticles(articles) {
    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.classList.add('scp-article');
        articleElement.innerHTML = `
            <h2><a href="article.html?id=${article.id}">${article.title}</a></h2>
            <pre>${article.content}</pre>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

// Function to generate individual article pages
function createArticlePages(articles) {
    articles.forEach(article => {
        const articleContent = `
            <article class="scp-article">
                <h2>${article.title}</h2>
                <pre>${article.content}</pre>
            </article>
        `;
        createArticlePage(article.id, articleContent);
    });
}

// Function to create individual article pages dynamically
function createArticlePage(articleId, content) {
    const articlePageContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Article - C.U.R.E.</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <header>
                <h1>C.U.R.E. - Monster Containment Site</h1>
                <nav>
                    <ul id="menu">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="add-article.html">Add Article</a></li>
                    </ul>
                </nav>
            </header>
            <main id="article">
                ${content}
            </main>
            <footer>
                <p>&copy; 2024 C.U.R.E. All rights reserved.</p>
            </footer>

            <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
            <script src="script.js"></script>
        </body>
        </html>
    `;

    // Create a Blob URL for the article page content
    const blob = new Blob([articlePageContent], { type: 'text/html' });
    const articlePageUrl = URL.createObjectURL(blob);

    // Create a link for the article in the index page
    const indexArticleLink = document.createElement('a');
    indexArticleLink.href = articlePageUrl;
    indexArticleLink.target = '_blank'; // Open in new tab
    document.body.appendChild(indexArticleLink); // Append link to document body

    // Cleanup: Revoke the Blob URL after use to free up memory
    URL.revokeObjectURL(articlePageUrl);
}

// Function to update the menu with articles
function updateMenu(articles) {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';

    articles.forEach((article, index) => {
        const menuItem = document.createElement('li');
        menuItem.innerHTML = `<a href="article.html?id=${article.id}">${article.title}</a>`;
        menuContainer.appendChild(menuItem);
    });
}

// Function to fetch article details based on ID from Supabase (used in article.html)
async function fetchArticleDetails() {
    try {
        // Get article ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        // Fetch article details from Supabase
        let { data: article, error } = await supabaseClient
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (error) {
            throw error;
        }

        displayArticle(article);
    } catch (error) {
        console.error('Error fetching article details:', error.message);
    }
}

// Function to display article details on the page (used in article.html)
function displayArticle(article) {
    const articleTitleElement = document.getElementById('articleTitle');
    const articleContentElement = document.getElementById('articleContent');

    if (articleTitleElement && articleContentElement) {
        articleTitleElement.textContent = article.title;
        articleContentElement.textContent = article.content;
    } else {
        console.error('Article title or content element not found.');
    }
}

// Load articles when the page loads
fetchArticles();

// If article.html is loaded, fetch and display the article details
if (window.location.pathname.includes('article.html')) {
    fetchArticleDetails();
}
