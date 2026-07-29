<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<a class="skip-link" href="#content">Skip to content</a>
<header class="site-header">
  <div class="container nav-wrap">
    <a class="brand" href="<?php echo esc_url(home_url('/')); ?>">
      <?php if (function_exists('the_custom_logo') && has_custom_logo()) : the_custom_logo(); else : ?>
        <span>Bean & Bloom</span>
      <?php endif; ?>
    </a>
    <nav class="site-nav" aria-label="Primary navigation">
      <?php wp_nav_menu(array('theme_location' => 'primary', 'container' => false, 'menu_class' => 'menu', 'fallback_cb' => false)); ?>
      <a href="<?php echo esc_url(home_url('/products/')); ?>" style="margin-left:1rem; font-weight:700; color:var(--accent);">Products</a>
    </nav>
  </div>
</header>
<main id="content">
