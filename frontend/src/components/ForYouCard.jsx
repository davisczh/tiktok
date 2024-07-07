import "./ForYouCard.css";
import PropTypes from "prop-types";

const ForYouCard = ({ product }) => (
  <div className="for-you-card">
    <div className="image-container">
      <img src={product.imgUrl} alt={product.title} />
    </div>
    <div className="product-info">
      <h1>{product.title}</h1>
      <p className="sponsored">Sponsored</p>
      <button className="shop-now-button">Shop now</button>
    </div>
  </div>
);

// ForYouCard.propTypes = {
//   product: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     name: PropTypes.string.isRequired,
//     image: PropTypes.string.isRequired,
//   }).isRequired,
// };

export default ForYouCard;
