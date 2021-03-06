import styled from "styled-components";
import Card from "./styled/Card";
import stringToHslColor from "../utils/stringToHslColor";
import FundingStats from "./FundingStats";

const DreamCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
  h3 {
    font-weight: 500;
    margin-bottom: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
  }
  p {
    color: #333;
    line-height: 1.4;
  }
  > div {
    padding: 15px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    justify-content: space-between;
  }
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: center;
  }
  transition: box-shadow 75ms ease-in-out;
  &:hover {
    box-shadow: 0 12px 20px 0 #e0e5ea;
  }
`;

const ImgPlaceholder = styled.div`
  background: ${props => props.color};
  flex: 0 0 200px !important;
`;
const truncate = (string, n) =>
  string.length > n ? string.substr(0, n - 1) + "..." : string;

export default ({ dream }) => {
  return (
    <DreamCard>
      {dream.images.length ? (
        <img src={dream.images[0].small} />
      ) : (
        <ImgPlaceholder color={stringToHslColor(dream.title)} />
      )}
      <div>
        <div>
          <h3>{dream.title}</h3>

          <p>{dream.summary}</p>
        </div>

        <FundingStats
          currentNumberOfGrants={dream.currentNumberOfGrants}
          minGoalGrants={dream.minGoalGrants}
          maxGoalGrants={dream.maxGoalGrants}
        />
      </div>
    </DreamCard>
  );
};
