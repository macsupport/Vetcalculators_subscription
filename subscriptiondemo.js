setTimeout(function() {


    const state = {};
    function setState(attr) {
        Object.assign(state, attr);
        render(state);
    }

    setState({
        error: '',
        status: 'Loading...',
        product1: {}
    });
        // register  products
    store.register([{
        id:    '001',
        type:   store.PAID_SUBSCRIPTION,
        alias: 'Vetcalculators Subscription'
    }]);

    // Setup the receipt validator service.
    store.validator = 'https://validator.fovea.cc/v1/validate?appName=vetcalculators&apiKey=7d0cbebf-562c-4c7a-a172-2db6a8e93a62';

  
store.when("001").approved(function(product) {
    product.verify();
});
store.when("001").verified(function(product) {
    product.finish();
});
store.when("001").cancelled(function(product) {
    product.finish();
});
    // Show errors for 20 seconds.
    store.error(function(error) {
        setState({ error: `ERROR ${error.code}: ${error.message}` });
        setTimeout(function() {
            setState({ error: `` });
        }, 20000);
    });

    
        

    // Called when any subscription product is updated
    store.when('001').updated(function() {

      const product1 = store.get('001') || {};
        // const product2 = store.get('002') || {};
        // const product3 = store.get('003') || {};

        let status = 'Please subscribe below';
        if (product1.owned)
            status = 'Subscribed';
        else if (product1.state === 'approved')
            status = 'Processing...';

        setState({ product1, status });
    });

   
//render on page
    function render() {

      const ownedProduct1 = state.product1.owned ? `<dic class="card-footer">Subscribed to ${product1.alias}</div>` : '';

        const purchaseProduct1 = state.product1.canPurchase
            ? `<button class="button button-raised" onclick="store.order('001')">Subscribe 1</button>` : '';
      

        const body = document.getElementById('subscribe');
        body.innerHTML = `
<div class="card"> 
<div class="card-content"> 
${state.error}
<pre>
subscription: ${state.status}

id:     ${state.product1.id          || ''}
title:  ${state.product1.title       || ''}
state:  ${state.product1.state       || ''}
descr:  ${state.product1.description || ''}
price:  ${state.product1.price       || ''}
expiry: ${state.product1.expiryDate  || ''}
Billing Period: ${state.product1.billingPeriod  || ''} ${state.product1.billingPeriodUnit  || ''}
</pre>
${purchaseProduct1}
<button class="button button-raised" onclick="store.manageBilling()">Billing</button>
<button class="button button-raised" onclick=" store.manageSubscriptions();">Subscriptions</button>
<button class="button button-raised" onclick=" store.refresh();">Refresh</button>



</div>
<div class="card-footer"> ${ownedProduct1}</div>
</div>

        `;
    }

    store.refresh();  


            }, 100);