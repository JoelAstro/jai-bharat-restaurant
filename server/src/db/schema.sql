-- ============================================================================
-- Jai Bharat Family Restaurant - Neon PostgreSQL Schema (DDL)
-- Tracks customer-facing sections with Cloudinary automated image lifecycle
-- ============================================================================

-- 1. HOME BANNERS TABLE
CREATE TABLE IF NOT EXISTS home_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255),
    button_text VARCHAR(100),
    button_link VARCHAR(255),
    display_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_home_banners_is_active ON home_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_home_banners_display_order ON home_banners(display_order);

-- 2. MENU CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    cloudinary_public_id VARCHAR(255),
    display_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_slug ON menu_categories(slug);
CREATE INDEX IF NOT EXISTS idx_menu_categories_is_active ON menu_categories(is_active);

-- 3. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price INT NOT NULL, -- price stored in paise (e.g. 25000 = ₹250.00)
    is_veg BOOLEAN DEFAULT true NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    image_url TEXT,
    cloudinary_public_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_menu_items_category FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured);

-- 4. ABOUT SECTIONS TABLE
CREATE TABLE IF NOT EXISTS about_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'story', 'philosophy', 'chef', 'ambiance'
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    cloudinary_public_id VARCHAR(255),
    display_order INT DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_about_sections_key ON about_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_about_sections_is_active ON about_sections(is_active);

-- 5. OFFERS & PROMOTIONS TABLE
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) DEFAULT 'PERCENTAGE' NOT NULL, -- 'PERCENTAGE' or 'FIXED'
    discount_value INT NOT NULL, -- Percentage (e.g. 20 for 20%) or Paise
    min_order_amount INT DEFAULT 0 NOT NULL, -- in paise
    max_discount INT, -- in paise
    image_url TEXT,
    cloudinary_public_id VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_offers_code ON offers(code);
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON offers(is_active);
