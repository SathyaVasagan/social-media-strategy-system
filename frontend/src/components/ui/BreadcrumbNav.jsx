import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getBrandById } from "../../services/brandService";

const isMongoId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

const BreadcrumbNav = () => {
  const location = useLocation();
  const { brandId } = useParams();

  const [brandName, setBrandName] = useState(null);

  const pathnames = location.pathname.split("/").filter(Boolean);

  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId) return;

      try {
        const brand = await getBrandById(brandId);

        setBrandName(brand.name);
      } catch {
        setBrandName("Brand");
      }
    };

    fetchBrand();
  }, [brandId]);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link to="/" className="text-blue-600">
        Home
      </Link>

      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;

        let label = value;
        let path = `/${pathnames.slice(0, index + 1).join("/")}`;

        /* Brands page */

        if (value === "brands") {
          label = "Brands";
          path = "/brands";
        }

        /* Brand workspace */

        if (value === brandId) {
          label = brandName || "Brand";
          path = `/brand/${brandId}`;
        }

        /* Hide raw MongoDB ids (postId/backlinkId) */

        if (isMongoId(value) && value !== brandId) {
          label = "Details";
        }

        /* Capitalize normal routes */

        if (!isMongoId(value) && value !== brandId && value !== "brands") {
          label = value.charAt(0).toUpperCase() + value.slice(1);
        }

        if (isLast) {
          return (
            <Typography key={path} color="text.primary">
              {label}
            </Typography>
          );
        }

        return (
          <Link key={path} to={path} className="text-blue-600">
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;
