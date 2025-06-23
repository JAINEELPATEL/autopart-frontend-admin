// Updates needed for your authController.js

// 1. Add admin-specific login validation
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password, role } = req.body;

    const user = await Users.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phone_number: emailOrPhone }],
      },
    });

    if (!user) {
      // If role is provided, show specific error
      if (role === "seller") {
        return res.status(404).json({ message: "Seller not found" });
      } else if (role === "buyer") {
        return res.status(404).json({ message: "Buyer not found" });
      } else if (role === "admin") {
        return res.status(404).json({ message: "Admin not found" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }

    if (role && user.type !== role) {
      return res.status(403).json({ message: `User is not a ${role}` });
    }
    if (!user.password) {
      return res.status(400).json({ message: "User password not set" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.email_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET,
      { expiresIn: "30h" }
    );
    const userDetails = user.toJSON();
    delete userDetails.password;

    // Use the value from the DB
    res.json({
      token,
      role: user.type,
      userId: user.id,
      isCompanydetailsFilled: user.isCompanydetailsFilled,
      user: userDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Add admin-specific register validation
exports.register = async (req, res) => {
  try {
    const {
      name,
      password,
      type,
      email,
      phone_number,
      logo,
      company_phone_number,
      address,
      address2,
      city,
      country,
      state,
      zip_code,
      vat_number,
      companyName,
    } = req.body;

    if (!["buyer", "seller", "admin"].includes(type)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // For admin registration, you might want to add additional validation
    if (type === "admin") {
      // You could add admin-specific validation here
      // For example, require a special admin registration code
      // const { adminCode } = req.body;
      // if (adminCode !== process.env.ADMIN_REGISTRATION_CODE) {
      //   return res.status(403).json({ message: "Invalid admin registration code" });
      // }
    }

    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const existingPhone = await Users.findOne({ where: { phone_number } });
    if (existingPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      password: hashedPassword,
      type,
      email,
      phone_number,
      email_verified: false,
    };

    if (type === "seller") {
      Object.assign(newUser, {
        logo,
        company_phone_number,
        address,
        city,
        zip_code,
        vat_number,
        company_name: companyName,
        address2,
        country,
        state,
      });
    }

    const createdUser = await Users.create(newUser);
    const token = jwt.sign(
      { id: createdUser.id, email, type: type },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    await sendVerificationEmail(email, token);

    res.json({
      userId: createdUser.id,
      role: createdUser.type,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        type: createdUser.type,
        phone_number: createdUser.phone_number,
      },
      message: "User registered successfully! Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Add admin-specific protected route
exports.adminProtectedRoute = async (req, res) => {
  try {
    // This route is already protected by the authorizeRoles middleware
    // but we can add additional admin-specific logic here
    const user = await Users.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: `Welcome ${user.name}`,
      user: user,
      isAdmin: user.type === "admin",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update your auth routes to include admin-specific endpoints
// In your auth routes file, add:

// router.get("/admin-protected", verifyToken, authorizeRoles("admin"), adminProtectedRoute);
// router.get("/admin", verifyToken, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Admin access granted" });
// });
