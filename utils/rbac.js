export const permissions = [
    {
        role: 'vendor',
        actions: [
            'get_profile',
            'update_profile',
            'manage_products',
            'view_sales',
            'update_inventory'
        ]
    },
    {
        role: 'buyer',
        actions: [
            'get_profile',
            'update_profile',
            'browse_products',
            'place_orders',
            'view_order_history'
        ]
    },
    {
        role: 'farmer',
        actions: [
            'get_profile',
            'update_profile',
            'list_harvest',
            'track_shipments',
            'view_sales_data'
        ]
    },
    {
        role: 'investor',
        actions: [
            'get_profile',
            'update_profile',
            'view_investment_opportunities',
            'track_roi',
            'contact_vendors'
        ]
    }
];
  