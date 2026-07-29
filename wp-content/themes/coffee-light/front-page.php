<?php get_header(); ?>
<section class="hero">
  <div class="container hero-grid">
    <div>
      <p class="muted" style="font-weight:700; letter-spacing:0.16em; text-transform:uppercase;">Small-batch coffee, crafted daily</p>
      <h1>Freshly brewed comfort for every morning ritual.</h1>
      <p>Bean & Bloom serves velvety espresso, signature lattes, and cozy pastries in a light-filled café built for slow sips and fast connections.</p>
      <a class="btn" href="#menu">Explore the menu</a>
      <a class="btn secondary" href="#about">Visit the café</a>
    </div>
    <div class="hero-card">
      <div class="hero-visual"></div>
    </div>
  </div>
</section>

<section class="section" id="about">
  <div class="container">
    <div class="section-head">
      <h2>Why guests love us</h2>
      <p>Modern comfort with a thoughtful coffee experience.</p>
    </div>
    <div class="grid grid-3">
      <article class="card">
        <h3>Craft roasting</h3>
        <p class="muted">We source bright, seasonal beans and roast them in small batches for rich flavor.</p>
      </article>
      <article class="card">
        <h3>Fast, friendly service</h3>
        <p class="muted">A smooth counter experience with beautifully prepared drinks that arrive quickly.</p>
      </article>
      <article class="card">
        <h3>Cozy atmosphere</h3>
        <p class="muted">Warm lighting, soft music, and plenty of space to settle in for a while.</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="products">
  <div class="container">
    <div class="section-head">
      <h2>Featured products</h2>
      <p>Admin can add new coffee products here and they will appear automatically.</p>
    </div>
    <div class="grid grid-3 posts-list">
      <?php
      $products = new WP_Query(array(
        'post_type' => 'coffee_product',
        'posts_per_page' => 3,
      ));
      if ($products->have_posts()) : while ($products->have_posts()) : $products->the_post(); ?>
        <article class="card">
          <?php if (has_post_thumbnail()) : the_post_thumbnail('large'); endif; ?>
          <div class="post-meta"><?php echo esc_html(get_post_meta(get_the_ID(), '_coffee_product_price', true) ?: 'Price on request'); ?></div>
          <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
          <p class="muted"><?php the_excerpt(); ?></p>
        </article>
      <?php endwhile; wp_reset_postdata(); else : ?>
        <article class="card">
          <h3>Signature Espresso</h3>
          <p class="muted">A bold shot with notes of caramel and dark chocolate.</p>
        </article>
        <article class="card">
          <h3>Maple Latte</h3>
          <p class="muted">Creamy latte with a hint of maple and toasted spice.</p>
        </article>
        <article class="card">
          <h3>Golden Morning Brew</h3>
          <p class="muted">A bright single-origin pour-over for slow mornings.</p>
        </article>
      <?php endif; ?>
    </div>
  </div>
</section>

<section class="section" id="menu">
  <div class="container">
    <div class="section-head">
      <h2>Fresh stories from the café</h2>
      <p>Seasonal favorites and behind-the-scenes updates.</p>
    </div>
    <div class="grid grid-3 posts-list">
      <?php
      $featured_posts = new WP_Query(array(
        'post_type' => 'post',
        'posts_per_page' => 3,
      ));
      if ($featured_posts->have_posts()) : while ($featured_posts->have_posts()) : $featured_posts->the_post(); ?>
        <article class="card">
          <?php if (has_post_thumbnail()) : the_post_thumbnail('large'); endif; ?>
          <div class="post-meta"><?php echo esc_html(get_the_date()); ?></div>
          <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
          <p class="muted"><?php the_excerpt(); ?></p>
        </article>
      <?php endwhile; wp_reset_postdata(); else : ?>
        <article class="card">
          <h3>House Blend</h3>
          <p class="muted">A smooth, balanced roast for every day.</p>
        </article>
        <article class="card">
          <h3>Almond Cloud Latte</h3>
          <p class="muted">Creamy, sweet, and lightly spiced for afternoon breaks.</p>
        </article>
        <article class="card">
          <h3>Morning Light</h3>
          <p class="muted">A bright pour-over with citrus and floral notes.</p>
        </article>
      <?php endif; ?>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="grid grid-2">
      <article class="card">
        <h3>Visit us</h3>
        <p class="muted">Open daily from 7am to 4pm. Stop by for a quiet cup, a meeting, or a sweet break.</p>
      </article>
      <article class="card">
        <h3>Book a tasting</h3>
        <p class="muted">Join us for guided coffee tastings every Friday afternoon and discover new favorites.</p>
      </article>
    </div>
  </div>
</section>

<?php get_footer(); ?>
