<?php get_header(); ?>
<section class="section">
  <div class="container">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <article class="card entry-content">
        <h1><?php the_title(); ?></h1>
        <div class="post-meta"><?php echo esc_html(get_the_date()); ?></div>
        <?php if (has_post_thumbnail()) : the_post_thumbnail('large'); endif; ?>
        <?php the_content(); ?>
      </article>
    <?php endwhile; endif; ?>
  </div>
</section>
<?php get_footer(); ?>
