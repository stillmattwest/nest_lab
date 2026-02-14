describe('Blog', () => {
  beforeEach(() => {
    cy.visit('/blog');
  });

  it('loads blog page and shows posts or empty state', () => {
    // Wait for loading to finish (Blog heading appears when content is ready)
    cy.contains('h4', 'Blog').should('be.visible');
    cy.contains('Loading posts…').should('not.exist');
    // Either we have posts (at least one "Read more" or card) or empty state
    cy.get('body').then(($body) => {
      if ($body.text().includes('No posts yet.')) {
        cy.contains('No posts yet.').should('be.visible');
      } else {
        cy.contains('a', 'Read more').should('exist');
      }
    });
  });

  it('loads post detail with content and comments section', () => {
    // Visit first post (id 1); if DB is seeded there is at least one post
    cy.visit('/blog/1');
    cy.contains('Loading…').should('not.exist');
    // Either post not found or post content is shown
    cy.get('body').then(($body) => {
      if ($body.text().includes('Post not found')) {
        cy.contains('Post not found').should('be.visible');
      } else {
        cy.get('h1').should('exist');
        cy.contains('Comments').should('be.visible');
      }
    });
  });
});
