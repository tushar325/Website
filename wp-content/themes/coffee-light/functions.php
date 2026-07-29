<?php
add_theme_support('title-tag');
add_theme_support('post-thumbnails');
add_theme_support('custom-logo', array(
  'height'      => 60,
  'width'       => 180,
  'flex-height' => true,
  'flex-width'  => true,
));
add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
register_nav_menus(array(
  'primary' => __('Primary Menu', 'coffee-light'),
));

function coffee_light_register_products() {
  $labels = array(
    'name' => __('Products', 'coffee-light'),
    'singular_name' => __('Product', 'coffee-light'),
    'add_new_item' => __('Add New Product', 'coffee-light'),
    'edit_item' => __('Edit Product', 'coffee-light'),
    'new_item' => __('New Product', 'coffee-light'),
    'view_item' => __('View Product', 'coffee-light'),
    'search_items' => __('Search Products', 'coffee-light'),
    'not_found' => __('No products found', 'coffee-light'),
  );

  $args = array(
    'labels' => $labels,
    'public' => true,
    'show_in_rest' => true,
    'has_archive' => true,
    'rewrite' => array('slug' => 'products'),
    'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    'menu_icon' => 'dashicons-coffee',
    'menu_position' => 5,
    'show_in_admin_bar' => true,
  );

  register_post_type('coffee_product', $args);
}
add_action('init', 'coffee_light_register_products');

function coffee_light_product_price_meta() {
  add_meta_box('coffee_product_price', __('Product Price', 'coffee-light'), 'coffee_light_render_product_price_meta', 'coffee_product', 'side', 'default');
}
add_action('add_meta_boxes', 'coffee_light_product_price_meta');

function coffee_light_render_product_price_meta($post) {
  $price = get_post_meta($post->ID, '_coffee_product_price', true);
  echo '<label for="coffee_product_price">Price</label>';
  echo '<input type="text" id="coffee_product_price" name="coffee_product_price" value="'.esc_attr($price).'" style="width:100%; margin-top:4px;" />';
}

function coffee_light_save_product_price($post_id) {
  if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
    return;
  }

  if (isset($_POST['coffee_product_price'])) {
    update_post_meta($post_id, '_coffee_product_price', sanitize_text_field($_POST['coffee_product_price']));
  }
}
add_action('save_post_coffee_product', 'coffee_light_save_product_price');

function coffee_light_scripts() {
  wp_enqueue_style('coffee-light-style', get_stylesheet_uri(), array(), wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'coffee_light_scripts');

function coffee_light_excerpt_length($length) {
  return 20;
}
add_filter('excerpt_length', 'coffee_light_excerpt_length');
