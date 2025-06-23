export const permissions = [
    {
        role: 'vendor',
        actions: [
            'get_profile',
            'update_profile',
            'manage_products',
            'view_sales',
            'update_inventory',
            'create_vendor',
            'get_vendor',
            'update_vendor',
            'create_vendor_asset',
            'get_vendor_asset',
            'update_vendor_asset',
            'delete_vendor_asset',
            'get_vendor_assets'
        
        ]
    },
    {
        role: 'buyer',
        actions: [
            'get_profile',
            'update_profile',
            'browse_products',
            'place_orders',
            'view_order_history',
            'create_buyer',
            'get_buyer',
            'update_buyer',
            'create_review',
            'get_produce',
            'create_order',
            'get_order',
            'update_order',
            'place_orders',
            'view_sales'
        ]
    },
    {
        role: 'farmer',
        actions: [
            'get_profile',
            'update_profile',
            'list_harvest',
            'track_shipments',
            'view_sales_data',
            'view_sales',
            'create_farmer',
            'get_farmer',
            'update_farmer',
            'create_produce',
            'get_produce',
            'update_produce',
            'delete_produce',
            'get_vendor_assets',
            'create_order',
            'get_order',
            'update_order',
            'place_orders'
        ]
    },
    {
        role: 'investor',
        actions: [
            'get_profile',
            'update_profile',
            'view_investment_opportunities',
            'track_roi',
            'contact_vendors',
            'create_investor',
            'get_investor',
            'update_investor',
            'apply_investment',
            ''
        ]
    },
    {
        role: 'admin',
        actions: [
            'get_profile',
            'update_profile',
            'view_all_users',
            'update_user_status',
            'approve_user_account',
            'suspend_user',
            'delete_user',
            'manage_users',
            'view_all_orders',
            'update_order_status',
            'view_all_reviews',
            'delete_review',
            'get_all_data',
            'create_investment',
            'manage_investments',
            'approve_user_investment'
        ]
    },
    {
        role: 'super_admin',
        actions: [
            'get_profile',
            'update_profile',
            'view_all_users',
            'update_user_status',
            'approve_user_account',
            'suspend_user',
            'delete_user',
            'manage_users',
            'view_all_orders',
            'update_order_status',
            'view_all_reviews',
            'delete_review',
            'get_all_data',
            'promote_user',
            'demote_user',
            'delete_admin',
            'create_admin',
            'access_audit_logs', // Optional future action
            'override_permissions', // Optional future action
            'manage_orders',
            'manage_reviews',
            'manage_products',
            'view_sales',
            'update_inventory',
            'create_vendor',
            'get_vendor',
            'update_vendor',
            'create_vendor_asset',
            'get_vendor_asset',
            'update_vendor_asset',
            'delete_vendor_asset',
            'browse_products',
            'place_orders',
            'view_order_history',
            'create_buyer',
            'get_buyer',
            'update_buyer',
            'create_review',
            'list_harvest',
            'track_shipments',
            'view_sales_data',
            'create_farmer',
            'get_farmer',
            'update_farmer',
            'create_produce',
            'get_produce',
            'update_produce',
            'delete_produce',
            'view_investment_opportunities',
            'track_roi',
            'contact_vendors',
            'create_investor',
            'get_investor',
            'update_investor',
            'place_orders',
            'create_investment',
            'manage_investments',
            'approve_user_investment'
        ]
    }
      
      
];
  