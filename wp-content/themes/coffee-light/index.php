<?php get_header(); ?>
<section class="section">
  <div class="container">
    <div class="section-head">
      <h2>Latest coffee stories</h2>
      <p>Fresh updates from Bean & Bloom.</p>
    </div>
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <article class="card">
        <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
        <div class="post-meta"><?php echo esc_html(get_the_date()); ?></div>
        <p class="muted"><?php the_excerpt(); ?></p>
      </article>
    <?php endwhile; else : ?>
      <article class="card">
        <p class="muted">No posts yet. Add your first coffee story to get started.</p>
      </article>
    <?php endif; ?>
  </div>
</section>
<?php get_footer(); ?>
