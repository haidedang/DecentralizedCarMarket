pragma solidity ^0.4.21;

import "openzeppelin-solidity/contracts/ownership/rbac/RBACWithAdmin.sol";

contract RideAccessControl is RBACWithAdmin {

  string public constant ROLE_MANUFACTURER = "manufacturer";

  /// @dev modifier to scope access to manufacturers
  modifier onlyManufacturer() {
    checkRole(msg.sender, ROLE_MANUFACTURER);
    _;
  }

  /// @dev assign manufacturer role to an address
  /// @param addr address
  function addManufacturer(address addr) onlyAdmin public {
    addRole(addr, ROLE_MANUFACTURER);
  }

  /// @dev remove a manufacturer role from an address
  /// @param addr address
  function removeManufacturer(address addr) onlyAdmin public {
    removeRole(addr, ROLE_MANUFACTURER);
  }

  /**
   * @dev determine if addr is manufacturer
   * @param addr address
   * @return bool
  */
  function isManufacturer(address addr)
  view
  public
  returns (bool)
  {
    return hasRole(addr, ROLE_MANUFACTURER);
  }
}
