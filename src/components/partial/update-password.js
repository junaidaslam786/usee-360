import React, { useState } from "react";
import ProfileService from "../../services/profile";

export default function UpdatePassword(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState();

  const updatePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        props.responseHandler(["Password and confirm password did not match"]);
        return;
    }

    setLoading(true);
    const formResponse = await ProfileService.updatePassword({ currentPassword, newPassword});
    setLoading(false);

    if (formResponse?.error && formResponse?.message) {
        props.responseHandler(formResponse.message);
        return;
    }
      
    props.responseHandler("Password updated successfully!", true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
        <h4 className="title-2 mt-100">Change Password</h4>
        <form onSubmit={updatePassword}>
            <div className="row">
                <div className="col-md-12">
                    <label>
                        Current password (leave blank to leave unchanged):
                    </label>
                    <input
                        type="password"
                        name="ltn__name"
                        placeholder="Current Password"
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        value={currentPassword}
                        required
                    />
                    <label>New password (leave blank to leave unchanged):</label>
                    <input
                        type="password"
                        name="ltn__lastname"
                        placeholder="New Password"
                        onChange={(e) => setNewPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                        title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                        value={newPassword}
                        required
                    />
                    <label>Confirm new password:</label>
                    <input
                        type="password"
                        name="ltn__lastname"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}"
                        title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character."
                        value={confirmPassword}
                        required
                    />
                </div>
            </div>
            <div className="btn-wrapper">
                <button
                    type="submit"
                    className="btn theme-btn-1 btn-effect-1 text-uppercase"
                >
                    {
                        loading ? (
                            <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            </div>
                        ) : (
                            "Update Password"
                        )
                    }
                </button>
            </div>
        </form>
    </div>
  );
}
