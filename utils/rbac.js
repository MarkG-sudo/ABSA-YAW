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
            'delete_vendor_asset'
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
            'update_buyer'
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
            'create_farmer',
            'get_farmer',
            'update_farmer',
            'create_produce',
            'get_produce',
            'update_produce',
            'delete_produce'
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
            'update_investor'

        ]
    }
];
  