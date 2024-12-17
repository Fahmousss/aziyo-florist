import { rupiah } from '@/lib/utils';
import { Order, OrderProduct, PageProps } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function SuccessOrder({
    orders,
    auth,
}: PageProps<{ orders: Order[] }>) {
    const getDueDate = (createdAt: string): string => {
        const createdDate = new Date(createdAt);
        createdDate.setDate(createdDate.getDate() + 1); // Add 1 day
        return createdDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
    };
    const { post, processing } = useForm({
        order_id: orders[0].id,
        invoice_number: '7128c81b-cde5-4c33-8777-4d1d0fcd6377',
        due_date: getDueDate(orders[0]?.created_at || new Date().toISOString()),
        invoice_date: orders[0]?.created_at
            ? orders[0].created_at.split('T')[0]
            : new Date().toISOString().split('T')[0],
        customers_detail: {
            id: auth.user.id,
            name: auth.user.name,
            email: auth.user.email,
            // address: auth.user.address || '',
        },
        item_details: orders[0].order_products.map((order: OrderProduct) => ({
            item_id: order.id.toString() || 'ITEM001',
            description: order.papan_bungas?.deskripsi || 'no desk',
            price: Math.floor(order.harga) || 0,
            quantity: 1,
        })),
        payment_type: 'payment_link',
        amount: Math.floor(orders[0].total_harga),
    });

    const handleSubmit = () => {
        post('/print/invoice', {
            onSuccess: () => {
                alert('Invoice generated successfully!');
            },
            onError: (errors) => {
                console.error('Error generating invoice:', errors);
                alert('Failed to generate invoice.');
            },
        });
    };
    // console.log(auth.user);

    // const handlePrintInvoice = async () => {
    //     try {
    //         const response = await axios.post(
    //             'https://cors-anywhere.herokuapp.com/https://api.sandbox.midtrans.com/v1/invoices',
    //             {
    //                 order_id: orders[0].id,
    //                 invoice_number: uuidv4(),
    //                 invoice_date: orders[0]?.created_at
    //                     ? orders[0].created_at.split('T')[0]
    //                     : new Date().toISOString().split('T')[0],
    //                 due_date: getDueDate(
    //                     orders[0]?.created_at || new Date().toISOString(),
    //                 ),
    //                 customers_detail: {
    //                     id: auth.user.id,
    //                     name: auth.user.name,
    //                     email: auth.user.email,
    //                     address: auth.user.address || '',
    //                 },
    //                 item_details: orders[0].order_products.map(
    //                     (order: OrderProduct) => ({
    //                         id: order.id || 'ITEM001',
    //                         name: order.papan_bungas?.nama || 'Unnamed Item',
    //                         price: order.harga || 0,
    //                         quantity: 1,
    //                     }),
    //                 ),
    //                 payment_type: 'payment_link',
    //                 amount: orders[0].total_harga,
    //             },
    //             {
    //                 headers: {
    //                     Accept: 'application/json',
    //                     Authorization: `Basic U0ItTWlkLXNlcnZlci1JdzRUaUV3WkkxenRTc19mb3VHMzdYbzc=`, // Replace with actual authorization key
    //                 },
    //             },
    //         );

    //         const invoiceUrl = response.data.pdf_url; // Assuming 'pdf_url' is in the response data
    //         if (invoiceUrl) {
    //             window.open(invoiceUrl, '_blank'); // Open invoice in new tab
    //         } else {
    //             alert('Failed to generate invoice.');
    //         }
    //     } catch (error) {
    //         console.error('Error generating invoice:', error);
    //         toast.error('An error occurred while creating the invoice.');
    //     }
    // };
    return (
        <>
            <Toaster />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
                    <div className="mb-4 flex justify-center">
                        <i className="fas fa-check-circle text-4xl text-green-500"></i>
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-green-600">
                        Payment Successful !
                    </h1>
                    <p className="mb-4 text-lg font-semibold">
                        Thank you! Your payment has been received.
                    </p>
                    <p className="mb-4 text-gray-700">
                        Order ID : {orders[0].id} | Transaction ID :{' '}
                        {orders[0].transactions?.transaction_id}
                    </p>
                    <h2 className="mb-2 text-xl font-semibold">
                        Payment Details
                    </h2>
                    <div className="mb-4 rounded-lg bg-gray-100 p-4 shadow-inner">
                        <div className="mb-2 flex justify-between">
                            <span>
                                Total Amount : {rupiah(orders[0].total_harga)}
                            </span>
                        </div>
                    </div>
                    <button
                        className="rounded-lg bg-blue-600 px-6 py-2 text-white"
                        onClick={handleSubmit}
                    >
                        Print Invoice
                    </button>
                    <Link className="mt-4 block" href="/">
                        Back to home
                    </Link>
                </div>
            </div>
        </>
    );
}
