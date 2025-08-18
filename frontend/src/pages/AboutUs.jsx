import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-foreground mb-6">About Us</h1>
      <div className="bg-card p-6 rounded-lg shadow-md">
        <p className="text-lg text-muted-foreground mb-4">
          Welcome to Gamiex, your premium destination for games and gaming accessories. We’re dedicated to curating great titles, gear, and deals with a focus on quality, customer service, and a smooth shopping experience.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          Founded in 2025, Gamiex has come a long way from its beginnings. When we first started out, our passion for providing the best products drove us to do intense research and gave us the impetus to turn hard work and inspiration into a booming online store. We now serve customers all over the world, and are thrilled to be a part of the fair trade wing of the e-commerce industry.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <p className="text-lg text-muted-foreground">
          Sincerely,
        </p>
        <p className="text-lg text-muted-foreground font-semibold">
          The Gamiex Team
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
