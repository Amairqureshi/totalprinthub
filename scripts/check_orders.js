const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const envConfig = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envConfig[match[1]] = match[2].trim();
    }
});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrder() {
    const targetEmail = 'ravis30834@lawicon.com';

    console.log(`Checking orders for: ${targetEmail}`);

    // 1. Get User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
        console.error('Error fetching users:', userError);
        return;
    }

    const user = users.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());

    if (!user) {
        console.error('❌ User not found in auth.users!');
        return;
    }

    console.log(`✅ User Found: ${user.id}`);

    // 2. Get Orders (Admin Access - bypasses RLS)
    const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id);

    if (orderError) {
        console.error('Error fetching orders:', orderError);
        return;
    }

    console.log(`\n📋 Found ${orders.length} orders linked to this user:`);

    orders.forEach(order => {
        console.log(`- Order ${order.id}`);
        console.log(`  Status: ${order.status}`);
        console.log(`  Items: ${order.order_items.length}`);
        order.order_items.forEach(item => {
            console.log(`    * ${item.product_name} x${item.quantity}`);
        });
    });

    if (orders.length === 0) {
        console.log("⚠️ No orders linked to this user yet.");

        // Check for orphan orders
        const { data: orphans } = await supabase
            .from('orders')
            .select('id, email, user_id')
            .ilike('email', targetEmail);

        if (orphans && orphans.length > 0) {
            console.log(`\n⚠️ Found ${orphans.length} ORPHAN orders (matching email but wrong/null user_id):`);
            console.log(orphans);
        }
    }
}

checkOrder();
