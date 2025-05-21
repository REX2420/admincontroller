import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { getLowStockProducts } from "@/lib/database/actions/admin/dashboard/dashboard.actions";
const LowStockProducts = async () => {
  const products = await getLowStockProducts().catch((err) => console.log(err));
  return (
    <div className="w-full container mx-auto px-4 py-8">
      <div className="text-2xl font-bold mb-4 text-gray-800">Low Stock Products</div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">Product Name</TableCell>
                <TableCell className="font-semibold">Size</TableCell>
                <TableCell className="font-semibold">Stock Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.lowStockProducts?.length > 0 ? (
                products?.lowStockProducts.map((product: any) =>
                  product.subProducts?.map((subProduct: any) =>
                    subProduct.sizes?.map((size: any) => {
                      if (size && size.qty < 2) {
                        return (
                          <TableRow key={size._id} className="hover:bg-gray-50">
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{size.size}</TableCell>
                            <TableCell>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                {size.qty}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      }
                      return null;
                    })
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="py-8 text-gray-500">
                    No low stock products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default LowStockProducts;
